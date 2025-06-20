import { NextResponse } from 'next/server'

export async function POST() {
  console.log('DEBUG POST EXECUTED')
  return NextResponse.json({ status: 'success', message: 'POST working' })
}

export async function GET() {
  console.log('DEBUG GET EXECUTED')
  return NextResponse.json({ status: 'success', message: 'GET working' })
}