#!/bin/bash

set -euo pipefail

# Get the directory of the script
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Run the python script with uv
(cd "$SCRIPT_DIR" && uv run python main.py)