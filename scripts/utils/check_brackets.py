def check_brackets(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    open_brackets = content.count('{')
    close_brackets = content.count('}')
    print(f'{{: {open_brackets}, }}: {close_brackets}')
    open_parens = content.count('(')
    close_parens = content.count(')')
    print(f'(: {open_parens}, ): {close_parens}')

check_brackets('src/pages/CosmoChatbot.tsx')
