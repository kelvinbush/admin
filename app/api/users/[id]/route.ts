import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIdToFetch = params.id;

    // Use Clerk's server-side client to fetch user details
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userIdToFetch);
    
    // Extract user information
    const userInfo = {
      id: user.id,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || 'Unknown User',
      email: user.primaryEmailAddress?.emailAddress || 'No email',
      imageUrl: user.imageUrl,
    };

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
    
    // Handle specific Clerk errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
