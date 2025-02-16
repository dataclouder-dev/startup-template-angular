#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
import re

def update_json_file(file_path, new_name, new_app_id):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if file_path.name == 'package.json':
            data['name'] = new_name
            if 'config' in data:
                data['config']['appId'] = new_app_id
                data['config']['appIdDev'] = f"{new_app_id}.dev"
        elif file_path.name == 'ionic.config.json':
            data['name'] = new_name
        elif file_path.name == '.firebaserc':
            if 'projects' in data:
                data['projects']['default'] = new_name
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")

def update_capacitor_config(file_path, new_name, new_app_id):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Update appId
        content = re.sub(
            r'(appId:\s*[\'"]).*?([\'"])',
            f'\\1{new_app_id}\\2',
            content
        )
        
        # Update appName if it exists
        content = re.sub(
            r'(appName:\s*[\'"]).*?([\'"])',
            f'\\1{new_name}\\2',
            content
        )
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")

def update_environment_file(file_path, new_name, new_app_id):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Update the projectName using regex to preserve formatting
        content = re.sub(
            r'(projectName:\s*[\'"]).*?([\'"])',
            f'\\1{new_name.title()}\\2',
            content
        )
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")

def update_index_html(file_path, new_name):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Update the title tag using regex
        content = re.sub(
            r'<title>.*?</title>',
            f'<title>{new_name.title()}</title>',
            content
        )
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")

def rename_project(new_name, new_app_id):
    project_root = Path.cwd()
    
    # Files to update
    files_to_update = {
        'package.json': update_json_file,
        'ionic.config.json': update_json_file,
        # '.firebaserc': update_json_file, # i think i don't need to set a default instead pass --project on deploy
        'capacitor.config.ts': update_capacitor_config,
        'src/environments/environment.ts': update_environment_file,
        'src/environments/environment.prod.ts': update_environment_file,
        'src/index.html': lambda f, n, a: update_index_html(f, n)
    }
    
    for filename, update_func in files_to_update.items():
        file_path = project_root / filename
        if file_path.exists():
            update_func(file_path, new_name, new_app_id)
        else:
            print(f"Warning: {filename} not found")

    print("\nProject renamed successfully!")
    print("Please run 'npm install' to update node_modules with the new project name")
    print("You may need to rebuild your mobile projects:")
    print("- For iOS: npx cap sync ios")
    print("- For Android: npx cap sync android")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python rename_project.py <new-project-name> <new-app-id>")
        print("Example: python rename_project.py my-app com.example.myapp")
        sys.exit(1)
    
    new_project_name = sys.argv[1]
    new_app_id = sys.argv[2]
    rename_project(new_project_name, new_app_id)
