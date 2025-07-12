from fastapi import APIRouter
from app.models.schemas import IssueReportInput, Issue
from app.services import groq_service, issue_service

router = APIRouter()

@router.post("/")
def handle_issue(data: IssueReportInput):
    result = groq_service.call_groq(data.message, mode="issue")

    if all(k in result for k in ["issue_type", "description", "priority"]):
        issue = Issue(
            user_id=data.user_id,
            issue_type=result["issue_type"],
            description=result["description"],
            priority=result["priority"]
        )
        issue_service.save_issue(issue)
        return {"message": "Issue logged successfully", "issue": issue}

    return {"message": "Failed to understand issue", "response": result}


@router.get("/")
def list_issues():
    return issue_service.get_all_issues()
