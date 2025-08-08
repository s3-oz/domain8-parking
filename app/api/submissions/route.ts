import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'submissions.json')

interface Submission {
  id: string
  type: 'consumer' | 'domain' | 'business'
  domain: string
  timestamp: string
  data: {
    firstName?: string
    lastName?: string
    email: string
    phone?: string
    message?: string
    [key: string]: any
  }
}

async function ensureDataFile() {
  const dir = path.dirname(SUBMISSIONS_FILE)
  
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
  
  try {
    await fs.access(SUBMISSIONS_FILE)
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2))
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.type || !body.domain || !body.data?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create submission entry
    const submission: Submission = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: body.type,
      domain: body.domain,
      timestamp: new Date().toISOString(),
      data: body.data
    }
    
    // Ensure data file exists
    await ensureDataFile()
    
    // Read existing submissions
    const fileContent = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    const { submissions = [] } = JSON.parse(fileContent)
    
    // Add new submission
    submissions.push(submission)
    
    // Write back to file
    await fs.writeFile(
      SUBMISSIONS_FILE,
      JSON.stringify({ submissions }, null, 2)
    )
    
    return NextResponse.json({ 
      success: true, 
      id: submission.id 
    })
    
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const fileContent = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading submissions:', error)
    return NextResponse.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    )
  }
}