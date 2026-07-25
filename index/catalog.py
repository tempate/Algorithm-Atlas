"""
The site's list of projects, previously the `Available` database model.

The list is static, public and short, so a table bought nothing. A group's link
doubles as the template directory and a section's link as the template name:
("Algorithms", "sorting") resolves to "algorithms/sorting.html".
"""

PROJECTS = [
    ("Cryptography", [
        ("Asymmetric", "asymmetric"),
        ("Hash", "hash"),
        ("Symmetric", "symmetric"),
    ]),
    ("Artificial Intelligence", [
        ("Blocks", "blocks"),
        ("Flappy Bird", "flappy_bird"),
        ("Smart Rockets", "smart_rockets"),
        ("Steering Behaviours", "steering_behaviours"),
        ("XOR", "xor"),
    ]),
    ("Algorithms", [
        ("Maze Generation", "maze_generation"),
        ("Path Finding", "path_finding"),
        ("Regression", "regression"),
        ("Sorting", "sorting"),
        ("Traveling Salesman Problem", "tsp"),
    ]),
]


def group_link(name: str) -> str:
    """ The URL fragment and template directory for a group. """
    return name.replace(" ", "").lower()


def groups() -> list:
    """ The catalog in the shape index/home.html expects. """
    return [{
        "name": name,
        "link": group_link(name),
        "sections": [{"name": n, "link": link} for n, link in sections]
    } for name, sections in PROJECTS]


""" Every (directory, name) pair the projects view is allowed to render. """
PAGES = frozenset(
    (group_link(name), link)
    for name, sections in PROJECTS
    for _, link in sections
)
