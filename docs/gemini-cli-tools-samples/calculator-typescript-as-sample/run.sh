#!/bin/bash

set -euo pipefail

# Get the directory of the script
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Run the TypeScript script with deno
(cd "$SCRIPT_DIR" && deno run --allow-read main.ts)