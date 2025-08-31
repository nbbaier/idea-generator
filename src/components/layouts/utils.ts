import { cn } from "@/lib/utils";

export const layoutUtils = {
	// Flex utilities
	flexCenter: "flex items-center justify-center",
	flexBetween: "flex items-center justify-between",
	flexStart: "flex items-start justify-start",
	flexEnd: "flex items-end justify-end",

	// Spacing utilities
	spacing: {
		sm: "space-y-2",
		md: "space-y-4",
		lg: "space-y-6",
		xl: "space-y-8",
	},

	// Common responsive patterns
	responsive: {
		grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
		flexWrap: "flex flex-wrap gap-4",
		stackMobile: "flex flex-col md:flex-row gap-4",
	},
};

export const combineClasses = (
	...classes: (string | undefined | null | boolean)[]
): string => {
	return cn(classes);
};
