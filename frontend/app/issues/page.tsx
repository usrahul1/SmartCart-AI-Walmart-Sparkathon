"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { reportIssue, getIssues } from "@/lib/api"
import { AlertCircle, User, MessageSquare } from "lucide-react"

export default function IssuesPage() {
  const [userId, setUserId] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [issues, setIssues] = useState<any[]>([])
  const [issuesLoading, setIssuesLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !message) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await reportIssue(userId, message)
      setResponse(result.message || "Issue reported successfully!")
      setMessage("")
      // Refresh issues list
      fetchIssues()
    } catch (err) {
      setError("Failed to report issue. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchIssues = async () => {
    setIssuesLoading(true)
    try {
      const result = await getIssues()
      setIssues(result)
    } catch (err) {
      console.error("Failed to fetch issues:", err)
    } finally {
      setIssuesLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
          <AlertCircle className="mr-3" />
          Report an Issue
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your user ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-2" />
                Issue Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe the issue you're experiencing..."
                required
              />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            {response && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{response}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Report Issue"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm">
            If you're experiencing technical difficulties, please provide as much detail as possible including:
          </p>
          <ul className="list-disc list-inside text-blue-700 text-sm mt-2 space-y-1">
            <li>What you were trying to do</li>
            <li>What happened instead</li>
            <li>Any error messages you saw</li>
            <li>Your browser and device information</li>
          </ul>
        </div>

        {/* Issues Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reported Issues</h2>

          {issuesLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading issues...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {issues.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No issues reported yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {issues.map((issue, index) => (
                        <tr key={issue.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                issue.issue_type === "bug"
                                  ? "bg-red-100 text-red-800"
                                  : issue.issue_type === "feature"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {issue.issue_type || "General"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {issue.description || issue.message || "No description"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                issue.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : issue.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {issue.priority || "Low"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {issue.user_id || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                issue.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : issue.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {issue.status || "Open"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-gray-50 px-6 py-3">
                <button onClick={fetchIssues} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Refresh Issues
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
