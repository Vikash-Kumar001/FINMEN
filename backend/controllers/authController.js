export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "No token provided" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token payload" });

    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ message: "Google account must have a verified email" });

    let user = await User.findOne({ email: email.toLowerCase() });

    // ❌ Block login via Google if user is admin or educator
    if (user && user.role !== "student") {
      return res.status(403).json({ message: `Google login is allowed only for students.` });
    }

    // ✅ Create new user if doesn't exist (only student)
    if (!user) {
      user = await User.create({
        name: name || email,
        email: email.toLowerCase(),
        avatar: picture,
        role: "student",
        isVerified: true,
        fromGoogle: true,
      });
    }

    const authToken = generateToken(user._id);

    res
      .cookie("finmen_token", authToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Google login successful",
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(400).json({ message: "Google authentication failed" });
  }
};
