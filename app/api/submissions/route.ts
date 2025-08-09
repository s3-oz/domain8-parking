import { NextRequest, NextResponse } from 'next/server'
import { db, leads, type NewLead } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.type || !body.domain || !body.data?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get client info for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    
    // Parse UTM parameters if they exist
    const url = new URL(request.url)
    const utmSource = url.searchParams.get('utm_source')
    const utmMedium = url.searchParams.get('utm_medium')
    const utmCampaign = url.searchParams.get('utm_campaign')
    
    // Create lead entry
    const newLead: NewLead = {
      leadType: body.type as 'consumer' | 'domain' | 'business',
      domain: body.domain,
      email: body.data.email,
      firstName: body.data.firstName || null,
      lastName: body.data.lastName || null,
      phone: body.data.phone || null,
      company: body.data.company || null,
      message: body.data.message || null,
      metadata: body.data.metadata || null,
      ipAddress: ipAddress as any, // Type assertion for inet type
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      status: 'new',
    }
    
    // Insert into database
    const [insertedLead] = await db.insert(leads).values(newLead).returning()
    
    return NextResponse.json({ 
      success: true, 
      id: insertedLead.id 
    })
    
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url)
    const domain = url.searchParams.get('domain')
    const leadType = url.searchParams.get('type')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    
    // Build query
    let query = db.select().from(leads)
    
    // Apply filters
    const conditions = []
    if (domain) {
      conditions.push(eq(leads.domain, domain))
    }
    if (leadType) {
      conditions.push(eq(leads.leadType, leadType as any))
    }
    
    // Execute query with filters
    const results = await query
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      count: results.length,
      leads: results
    })
  } catch (error) {
    console.error('Error reading submissions:', error)
    return NextResponse.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    )
  }
}