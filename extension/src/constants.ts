// export const BASE_URL: string = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://vscode-puzzle.herokuapp.com";

export const BASE_URL = "https://api.puzzles.michaeldemar.co";
// export const BASE_URL = "http://localhost:8000";

export const TEMPLATE: string = `# {{ title }} (by [Puzzles](https://github.com/michaelfromyeg/vscode-puzzles))

Created: {{ date }}

Source: {{ source }}

ID: {{ id }}

## Puzzle

{{{ problem }}}
`;

export const PYTHON: string = `# Auto-generated by Puzzles

# Solution

def solve():
  '''
  ...
  '''
  print('TODO')

if __name__ == 'main':
  solve()

# And don't forget to write your tests!

assert(...,...)

`;

export const JAVASCRIPT: string = `// Auto-generated by vscode-puzzle

// Solution

/*
 * ...
 */
function solve() {
  console.log('TODO');
}

// And don't forget to write your tests!

console.assert(...,...);

`;