import os
import datetime
from typing import List, Optional, Dict, Set
import json
import argparse

class CodebaseExtractor:
    """A tool for extracting and documenting code from a codebase."""
    
    def __init__(self, 
                 base_directory: str,
                 output_file: str = 'codebase_snapshot.md',
                 config_file: Optional[str] = None,
                 include_paths: Optional[List[str]] = None):
        self.base_directory = os.path.abspath(base_directory)
        self.output_file = output_file
        self.config = self._load_config(config_file) if config_file else self._default_config()
        
        # Initialize include_paths from arguments or empty list if none provided
        self.include_paths = include_paths or []
        
        # Add include_paths from config if they exist
        if "include_paths" in self.config:
            self.include_paths.extend(self.config["include_paths"])
        
        # Convert all paths to absolute and normalize for easier comparison
        self.normalized_include_paths = [
            os.path.normpath(os.path.join(self.base_directory, p)) 
            for p in self.include_paths
        ]
        
        self.normalized_list_only_paths = [
            os.path.normpath(os.path.join(self.base_directory, p)) 
            for p in self.config.get('list_only_paths', [])
        ]
        
    def _default_config(self) -> Dict:
        return {
            "ignore_patterns": [
                'env', 'venv', '.git', '__pycache__', 
                'node_modules', 'build', 'dist', '.idea', 'app.py', 'codebase_snapshot.md'
            ],
            "ignore_extensions": [
                '.log', '.tmp', '.bak', '.pyc', '.pyo', 
                '.pyd', '.so', '.dll', '.dylib'
            ],
            "list_only_extensions": [
                '.png', '.jpg', '.jpeg', '.gif', '.ico', 
                '.svg', '.db', '.sqlite', '.pdf', '.zip'
            ],
            "list_only_paths": [],  # New option for files/folders to list without content
            "max_file_size_mb": 10,
            "include_paths": []  # Default empty list for include_paths
        }
    
    def _load_config(self, config_file: str) -> Dict:
        """Load configuration from a JSON file."""
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
                # Ensure required fields exist in the config
                if "include_paths" not in config:
                    config["include_paths"] = []
                if "list_only_paths" not in config:
                    config["list_only_paths"] = []
                return config
        except Exception as e:
            print(f"Error loading config file: {e}. Using default config.")
            return self._default_config()
    
    def _should_skip_file(self, filepath: str) -> bool:
        """Determine if a file should be skipped based on configuration."""
        filename = os.path.basename(filepath)
        
        # Check file size
        try:
            if os.path.getsize(filepath) > self.config['max_file_size_mb'] * 1024 * 1024:
                return True
        except OSError:
            return True
            
        # Check patterns and extensions
        return (any(pattern in filepath for pattern in self.config['ignore_patterns']) or
                any(filename.endswith(ext) for ext in self.config['ignore_extensions']))
    
    def _should_extract_content(self, filepath: str) -> bool:
        """
        Determine if a file's content should be extracted.
        Returns False if file should be list-only, True if content should be extracted.
        """
        filename = os.path.basename(filepath)
        abs_path = os.path.normpath(filepath)
        
        # First check if it's in include_paths (these always have content extracted)
        for include_path in self.normalized_include_paths:
            if os.path.exists(include_path):
                if os.path.isfile(include_path) and os.path.samefile(abs_path, include_path):
                    return True
                if os.path.isdir(include_path) and abs_path.startswith(include_path + os.sep):
                    return True
        
        # Then check if it has a list-only extension
        if any(filename.endswith(ext) for ext in self.config['list_only_extensions']):
            return False
            
        # Finally check if it's in a list-only path
        for list_path in self.normalized_list_only_paths:
            if os.path.exists(list_path):
                if os.path.isfile(list_path) and os.path.samefile(abs_path, list_path):
                    return False
                if os.path.isdir(list_path) and abs_path.startswith(list_path + os.sep):
                    return False
                    
        # If none of the above conditions match, extract the content
        return True
    
    def _is_path_included(self, filepath: str) -> bool:
        """
        Determine if a file should be included in processing at all.
        This checks both include_paths and list_only_paths.
        """
        abs_path = os.path.normpath(filepath)
        
        # If no include_paths and no list_only_paths specified, process all paths (that aren't ignored)
        if not self.include_paths and not self.config.get('list_only_paths'):
            return True
            
        # Check if it's in include_paths
        for include_path in self.normalized_include_paths:
            if os.path.exists(include_path):
                if os.path.isfile(include_path) and os.path.samefile(abs_path, include_path):
                    return True
                if os.path.isdir(include_path) and abs_path.startswith(include_path + os.sep):
                    return True
        
        # Check if it's in list_only_paths
        for list_path in self.normalized_list_only_paths:
            if os.path.exists(list_path):
                if os.path.isfile(list_path) and os.path.samefile(abs_path, list_path):
                    return True
                if os.path.isdir(list_path) and abs_path.startswith(list_path + os.sep):
                    # Only include files in list_only_paths if they're not already in include_paths
                    # (which we've already checked above)
                    return True
                    
        return False
    
    def extract(self, add_metadata: bool = True) -> None:
        """Extract and document the codebase."""
        try:
            with open(self.output_file, 'w', encoding='utf-8', errors='ignore') as output:
                if add_metadata:
                    self._write_metadata(output)
                
                # Walk the entire base directory
                for root, dirs, files in os.walk(self.base_directory):
                    # Skip ignored directories
                    dirs[:] = [d for d in dirs if not any(
                        pattern in d for pattern in self.config['ignore_patterns']
                    )]
                    
                    for filename in sorted(files):
                        filepath = os.path.join(root, filename)
                        
                        if self._should_skip_file(filepath):
                            continue
                            
                        # Check if this file should be included in processing
                        if not self._is_path_included(filepath):
                            continue
                            
                        relative_path = os.path.relpath(filepath, self.base_directory)
                        self._process_file(relative_path, filepath, output)
                        
            print(f"✓ Codebase documentation generated: {self.output_file}")
            
        except Exception as e:
            print(f"❌ Error during extraction: {e}")
    
    def _write_metadata(self, output_file) -> None:
        """Write metadata information to the output file."""
        metadata = {
            "Extraction Date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "Include Paths": self.include_paths,
            "List-Only Paths": self.config.get("list_only_paths", [])
        }
        
        output_file.write("# Codebase Documentation\n\n")
        output_file.write(json.dumps(metadata, indent=2) + "\n\n")
    
    def _process_file(self, relative_path: str, filepath: str, output_file) -> None:
        """Process and write a single file's content."""
        # Determine if this file should be extracted or just listed
        should_extract = self._should_extract_content(filepath)
        
        if should_extract:
            # For files where we extract content, include the full content without separate listing
            output_file.write(f"### {relative_path}\n```\n")
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    output_file.write(content)
                    output_file.write("\n```\n\n")
            except Exception as e:
                output_file.write(f"```\nError reading file: {e}\n```\n\n")
        else:
            # For list-only files, just include a simple listing
            output_file.write(f"### {relative_path} [List Only]\n\n")

if __name__ == "__main__":
    # Example usage
    extractor = CodebaseExtractor(
        base_directory=".",  # Current directory
        output_file="codebase_snapshot.md",  # Output file
        config_file="codebase_config.json"  # Optional config file
    )
    extractor.extract()