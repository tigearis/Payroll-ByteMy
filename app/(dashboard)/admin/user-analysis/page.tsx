'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface UserAnalysis {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    clerkUserId?: string;
    role: string;
    isActive: boolean;
    isStaff: boolean;
    createdAt: string;
  };
  dependencies: {
    assignedRoles: number;
    authoredNotes: number;
    backupConsultantPayrolls: number;
    billingItems: number;
    consultantAssignments: number;
    createdAssignments: number;
    invitationsSent: number;
    managedUsers: number;
    payrollAssignments: number;
    leaveRequests: number;
    userWorkSchedules: number;
  };
  canSafelyDelete: boolean;
  blockers: string[];
}

interface ReassignmentCandidate {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  computedName?: string;
  role: string;
}

export default function UserAnalysisPage() {
  const [email, setEmail] = useState('nathan.harris@invenco.net');
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null);
  const [candidates, setCandidates] = useState<ReassignmentCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  const analyzeUser = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/user-management?email=${encodeURIComponent(email)}&action=analyze`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const data = await response.json();
      setAnalysis(data);
      
      // Also get reassignment candidates
      const candidatesResponse = await fetch(`/api/admin/user-management?email=${encodeURIComponent(email)}&action=get_reassignment_candidates`);
      if (candidatesResponse.ok) {
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData.candidates || []);
      }
      
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!analysis || !selectedCandidate) return;
    
    setDeleting(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/user-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reassign_and_delete',
          fromUserId: analysis.user.id,
          toUserId: selectedCandidate,
          confirmDeletion: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Deletion failed');
      }
      
      const result = await response.json();
      alert(`✅ User deleted successfully: ${result.message}`);
      
      // Clear analysis after successful deletion
      setAnalysis(null);
      setCandidates([]);
      setSelectedCandidate('');
      
    } catch (err: any) {
      setError(err.message || 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Analysis & Management</h1>
        <Badge variant="destructive">Admin Only</Badge>
      </div>

      {/* User Input */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze User</CardTitle>
          <CardDescription>
            Enter user email to analyze dependencies before deletion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={analyzeUser} disabled={loading || !email}>
              {loading ? 'Analyzing...' : 'Analyze User'}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>ID:</strong> {analysis.user.id}</div>
                <div><strong>Email:</strong> {analysis.user.email}</div>
                <div><strong>Name:</strong> {analysis.user.firstName} {analysis.user.lastName}</div>
                <div><strong>Role:</strong> <Badge>{analysis.user.role}</Badge></div>
                <div><strong>Active:</strong> {analysis.user.isActive ? '✅' : '❌'}</div>
                <div><strong>Staff:</strong> {analysis.user.isStaff ? '✅' : '❌'}</div>
                <div><strong>Clerk ID:</strong> {analysis.user.clerkUserId || 'None'}</div>
                <div><strong>Created:</strong> {new Date(analysis.user.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle>Data Dependencies</CardTitle>
              <CardDescription>
                Relationships and data owned by this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {Object.entries(analysis.dependencies).map(([key, count]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className={count > 0 ? 'font-bold text-orange-600' : 'text-gray-500'}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deletion Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Deletion Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <strong>Can safely delete:</strong>
                  {analysis.canSafelyDelete ? (
                    <Badge variant="default" className="bg-green-500">✅ YES</Badge>
                  ) : (
                    <Badge variant="destructive">❌ NO</Badge>
                  )}
                </div>
                
                {analysis.blockers.length > 0 && (
                  <div>
                    <strong>Blockers:</strong>
                    <ul className="mt-2 space-y-1">
                      {analysis.blockers.map((blocker, index) => (
                        <li key={index} className="text-sm text-orange-600 ml-4">
                          • {blocker}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reassignment & Deletion */}
          {!analysis.canSafelyDelete && candidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Reassign Data Before Deletion</CardTitle>
                <CardDescription>
                  Select a user to receive this user's data assignments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reassign data to:</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                  >
                    <option value="">Select a user...</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.firstName} {candidate.lastName} ({candidate.email}) - {candidate.role}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button
                  variant="destructive"
                  onClick={deleteUser}
                  disabled={deleting || !selectedCandidate}
                  className="w-full"
                >
                  {deleting ? 'Deleting User...' : 'Reassign Data & Delete User'}
                </Button>
                
                <Alert>
                  <AlertDescription>
                    ⚠️ This action is irreversible. The user will be deleted from both the database and Clerk, and all their data will be reassigned to the selected user.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Direct deletion for safe users */}
          {analysis.canSafelyDelete && (
            <Card>
              <CardHeader>
                <CardTitle>Safe Deletion</CardTitle>
                <CardDescription>
                  This user can be safely deleted without data reassignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedCandidate('dummy'); // No reassignment needed
                    deleteUser();
                  }}
                  disabled={deleting}
                  className="w-full"
                >
                  {deleting ? 'Deleting User...' : 'Delete User'}
                </Button>
                
                <Alert className="mt-4">
                  <AlertDescription>
                    ⚠️ This action is irreversible. The user will be deleted from both the database and Clerk.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}