import { useState } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'

const BRANCH_TYPES = [
  { id: 'feature', name: 'Feature' },
  { id: 'bugfix', name: 'Bugfix' },
  { id: 'hotfix', name: 'Hotfix' },
]

function App() {
  const [jiraLink, setJiraLink] = useState('')
  const [branchType, setBranchType] = useState('feature')
  const [extraName, setExtraName] = useState('')
  const [copied, setCopied] = useState(false)

  const extractJiraId = (link) => {
    const match = link.match(/[A-Z]+-\d+/)
    return match ? match[0] : ''
  }

  const generateBranchName = () => {
    const jiraId = extractJiraId(jiraLink)
    if (!jiraId) return ''
    
    const namePart = extraName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return `${branchType}/${jiraId}${namePart ? `-${namePart}` : ''}`
  }

  const copyToClipboard = async () => {
    const branchName = generateBranchName()
    if (!branchName) return

    try {
      await navigator.clipboard.writeText(branchName)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const branchName = generateBranchName()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white mb-8">
          Branch Name Generator
        </h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="jira-link" className="block text-sm font-medium text-gray-300 mb-1">
              Jira Link
            </label>
            <input
              id="jira-link"
              type="text"
              value={jiraLink}
              onChange={(e) => setJiraLink(e.target.value)}
              placeholder="https://jira.com/PROJ-123"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="branch-type" className="block text-sm font-medium text-gray-300 mb-1">
              Branch Type
            </label>
            <select
              id="branch-type"
              value={branchType}
              onChange={(e) => setBranchType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              {BRANCH_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="extra-name" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              id="extra-name"
              type="text"
              value={extraName}
              onChange={(e) => setExtraName(e.target.value)}
              placeholder="Brief description"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
              <br /><br />
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg">
              <span className="text-white font-mono">
                {branchName || 'branch-name-preview'}
              </span>
              <button
                onClick={copyToClipboard}
                disabled={!branchName}
                className={`p-2 rounded-lg transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : branchName
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
