if(typeof Promise.withResolvers === 'undefined') {
	Promise.withResolvers = function<T>() {
		let resolve!: ReturnType<typeof Promise.withResolvers<T>>['resolve'];
		let reject!: ReturnType<typeof Promise.withResolvers<T>>['reject'];

		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		return { promise, resolve, reject };
	};
}
