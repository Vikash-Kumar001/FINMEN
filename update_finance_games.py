#!/usr/bin/env python3
"""
Script to update all Finance Kids game files to use getGameDataById
"""
import os
import re
from pathlib import Path

# Directory containing Finance Kids games
games_dir = Path("frontend/src/pages/Student/Finance/Kids")

# Map of game files to their gameIds (extracted from grep results)
# We'll update files that don't already have getGameDataById import
game_files_to_update = []

# Pattern to find files that need updating
import_pattern = re.compile(r'import.*useGameFeedback')
location_state_pattern = re.compile(r'location\.state\?\.(coinsPerLevel|totalCoins|totalXp)')
get_game_data_pattern = re.compile(r'getGameDataById')
game_id_pattern = re.compile(r'gameId="(finance-kids-\d+)"')

def extract_game_id(file_path):
    """Extract gameId from a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            match = game_id_pattern.search(content)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return None

def needs_update(file_path):
    """Check if file needs updating"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check if it already has getGameDataById
            if get_game_data_pattern.search(content):
                return False
            # Check if it has location.state pattern
            if location_state_pattern.search(content) and import_pattern.search(content):
                return True
    except Exception as e:
        print(f"Error checking {file_path}: {e}")
    return False

def update_file(file_path, game_id):
    """Update a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already updated
        if get_game_data_pattern.search(content):
            return False
        
        # Find the import section
        import_match = re.search(r'(import.*useGameFeedback[^\n]*)', content)
        if not import_match:
            return False
        
        # Add getGameDataById import after useGameFeedback import
        import_line = import_match.group(1)
        new_import = import_line + '\nimport { getGameDataById } from "../../../../utils/getGameData";'
        content = content.replace(import_line, new_import)
        
        # Find the component start and location.state lines
        # Pattern 1: Multiple lines with location.state
        pattern1 = re.compile(
            r'(const\s+\w+\s*=\s*useNavigate\(\);\s*\n\s*const\s+location\s*=\s*useLocation\(\);\s*\n)\s*'
            r'(//\s*Get.*?\n)?'
            r'(\s*const\s+coinsPerLevel\s*=\s*location\.state\?\.coinsPerLevel\s*\|\|\s*\d+[^\n]*\n)'
            r'(\s*const\s+totalCoins\s*=\s*location\.state\?\.totalCoins\s*\|\|\s*\d+[^\n]*\n)?'
            r'(\s*const\s+totalXp\s*=\s*location\.state\?\.totalXp\s*\|\|\s*\d+[^\n]*\n)?',
            re.MULTILINE
        )
        
        replacement = (
            r'\1'
            r'\n  // Get game data from game category folder (source of truth)\n'
            f'  const gameId = "{game_id}";\n'
            r'  const gameData = getGameDataById(gameId);\n'
            r'\n  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults\n'
            r'  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;\n'
            r'  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;\n'
            r'  const totalXp = gameData?.xp || location.state?.totalXp || 10;'
        )
        
        new_content = pattern1.sub(replacement, content)
        
        # If pattern1 didn't match, try simpler pattern
        if new_content == content:
            # Pattern 2: Single coinsPerLevel line
            pattern2 = re.compile(
                r'(const\s+\w+\s*=\s*useNavigate\(\);\s*\n\s*const\s+location\s*=\s*useLocation\(\);\s*\n)\s*'
                r'(//\s*Get.*?\n)?'
                r'(\s*const\s+coinsPerLevel\s*=\s*location\.state\?\.coinsPerLevel\s*\|\|\s*\d+[^\n]*\n)',
                re.MULTILINE
            )
            
            replacement2 = (
                r'\1'
                r'\n  // Get game data from game category folder (source of truth)\n'
                f'  const gameId = "{game_id}";\n'
                r'  const gameData = getGameDataById(gameId);\n'
                r'\n  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults\n'
                r'  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;\n'
                r'  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;\n'
                r'  const totalXp = gameData?.xp || location.state?.totalXp || 10;'
            )
            
            new_content = pattern2.sub(replacement2, content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
    return False

# Main execution
if __name__ == "__main__":
    updated_count = 0
    skipped_count = 0
    
    for file_path in games_dir.glob("*.jsx"):
        if needs_update(file_path):
            game_id = extract_game_id(file_path)
            if game_id:
                if update_file(file_path, game_id):
                    print(f"✓ Updated {file_path.name} with {game_id}")
                    updated_count += 1
                else:
                    print(f"✗ Failed to update {file_path.name}")
            else:
                print(f"? Could not find gameId in {file_path.name}")
        else:
            skipped_count += 1
    
    print(f"\nSummary: Updated {updated_count} files, Skipped {skipped_count} files")

