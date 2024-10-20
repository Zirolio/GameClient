import { typeOf } from 'ver/helpers';


export const deepCompairison = <T>(a: T, b: T) => {
	if(a === b) return true;

	const type = typeOf(a);
	if(!(type === 'object' || type === 'array' || type === 'function')) return a === b;

	for(const key in a) {
		const atype = typeOf(a[key]);

		if(atype === 'function') continue;
		if((key in (a as object)) !== (key in (b as object))) return false;
		if(atype !== typeOf(b[key])) return false;
		if((atype === 'object' || atype === 'array') && !deepCompairison<any>(a[key], b[key])) return false;
		if(a[key] !== b[key]) return false;
	}

	return true;
};
