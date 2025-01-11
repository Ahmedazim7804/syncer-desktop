function getLastUrlSegment(url: string) {
    return new URL(url).pathname.split("/").filter(Boolean).pop();
}

const publicRoutes: Array<string> = ["login"];

export { publicRoutes, getLastUrlSegment };
