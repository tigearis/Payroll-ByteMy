export async function GET() {
  console.log("TEST GET - Handler executing");
  return Response.json({ message: "GET works" });
}