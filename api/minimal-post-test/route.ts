export async function POST() {
  console.log("MINIMAL POST - Handler executing");
  return Response.json({ message: "minimal POST works" });
}