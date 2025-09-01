import { Streamdown } from "streamdown";

export default function Page() {
	const markdown =
		"# Hello World\n\nThis is **streaming** markdown!\n\n- this is an unordered list\n1. this is an ordered list";

	return <div className="p-8">This is a streaming page</div>;
}
