from app.models.schemas import Issue

# In-memory issue tracker
fake_issue_db: list[Issue] = []

def save_issue(issue: Issue):
    fake_issue_db.append(issue)

def get_all_issues():
    return fake_issue_db
