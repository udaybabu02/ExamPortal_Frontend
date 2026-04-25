import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import armsLogo from "@/assets/arms-logo.png";
// --- Step 1: Using your imported config ---
import { API_BASE_URL } from "@/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpMobile, setOtpMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---- Email + Password login (Connected to Database) ---- */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- Step 2: Updated fetch to use API_BASE_URL variable ---
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login("local-token-" + data.user.id, { 
          id: data.user.id, 
          name: data.user.name, 
          email: data.user.email 
        });
        toast({ title: "Welcome back!", description: `Logged in as ${data.user.name}` });
        navigate("/instructions");
      } else {
        toast({ variant: "destructive", title: "Login failed", description: data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  /* ---- OTP login (Simulated Demo) ---- */
  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(otpMobile.trim())) {
      toast({ variant: "destructive", title: "Invalid number", description: "Enter a valid 10-digit Indian mobile number." });
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    toast({ title: "OTP Sent (Demo)", description: `Your OTP is: ${code}` });
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (otp === generatedOtp) {
      login("local-token-otp", { id: "otp-user", name: "Verified User", email: otpMobile });
      toast({ title: "Welcome back!", description: `Logged in via Mobile` });
      navigate("/instructions");
    } else {
      toast({ variant: "destructive", title: "Invalid OTP", description: "The OTP you entered is incorrect." });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-5">
        <div className="flex flex-col items-center gap-1 text-center">
          <img src={armsLogo} alt="ARMS Logo" className="max-h-[90px] w-auto object-contain drop-shadow-lg p-2" />
          <p className="text-muted-foreground text-sm">Sign in to access your exams</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Choose your preferred login method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email & Password</TabsTrigger>
                <TabsTrigger value="otp">OTP Login</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="otp-mobile">Mobile Number</Label>
                      <div className="flex gap-2">
                        <span className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                        <Input
                          id="otp-mobile"
                          type="tel"
                          placeholder="9876543210"
                          maxLength={10}
                          value={otpMobile}
                          onChange={(e) => setOtpMobile(e.target.value.replace(/\D/g, ""))}
                          required
                        />
                      </div>
                    </div>
                    <Button type="button" className="w-full" onClick={handleSendOtp}>
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      OTP sent to +91 {otpMobile}
                    </p>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & Sign in
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => { setOtpSent(false); setOtp(""); }}>
                      Change number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;