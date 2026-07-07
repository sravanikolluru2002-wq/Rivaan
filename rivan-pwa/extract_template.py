import json
from bs4 import BeautifulSoup

def extract():
    with open('Rivan Admin Dashboard.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    template_script = soup.find('script', type='__bundler/template')
    
    if template_script:
        template = json.loads(template_script.string)
        with open('AdminDashboard_unbundled.html', 'w', encoding='utf-8') as f:
            f.write(template)
        print("Successfully extracted AdminDashboard_unbundled.html")
    else:
        print("Could not find __bundler/template script")

if __name__ == '__main__':
    extract()
