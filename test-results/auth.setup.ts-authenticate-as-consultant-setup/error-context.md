# Page snapshot

```yaml
- img "ByteMy Logo"
- paragraph: Welcome back! Please sign in to continue
- heading "Sign in to your account" [level=2]
- button "Continue with Google" [disabled]:
  - img
  - text: Continue with Google
- text: Or continue with email Email address
- textbox "Email address" [disabled]: consultant@test.payroll.com
- text: Password
- textbox "Password" [disabled]: Consultant789!xyz
- button "Signing in... Please wait while we fetch your data Signing in..." [disabled]:
  - img
  - heading "Signing in..." [level=3]
  - paragraph: Please wait while we fetch your data
  - text: Signing in...
- link "Don't have an account? Sign up":
  - /url: /sign-up
- region "Notifications alt+T"
- alert
- button "Open Next.js Dev Tools":
  - img
```