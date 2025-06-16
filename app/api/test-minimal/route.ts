export async function GET() {
  return Response.json({ message: "minimal GET success" });
}

export async function POST() {
  return Response.json({ message: "minimal POST success" });
}