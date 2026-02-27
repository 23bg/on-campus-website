const ROUTES = {
	ROOT: "/",
	HOME: "/",
	DASHBOARD: {
		ROOT: "/",
		LEADS: "/leads",
		STUDENTS: "/students",
		TEAM: "/team",
		COURSES: "/courses",
		BATCHES: "/batches",
		FEES: "/fees",
		INSTITUTE: "/institute",
		SETTINGS: "/settings",
		BILLING: "/billing",
		PROFILE: "/profile",
		PUBLIC_INSTITUTE: (slug: string) => `/i/${slug}`,
	},
	AUTH: {
		LOG_IN: "/login",
		SIGN_UP: "/signup",
		VERIFICATION: "/verification",
	},
	PRICING: "/pricing",
	DEMO_INSTITUTE: "/demo-institute",
};

export default ROUTES;
