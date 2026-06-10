router.post("/", async (req, res) => {
    try {
        const { userId, displayName } = req.body;

        const profile = profileService.createOrUpdate(userId, displayName);

        res.json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
