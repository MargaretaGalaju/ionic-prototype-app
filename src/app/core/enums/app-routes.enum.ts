enum PageRoutes {
    home = 'products',
    search = 'search',
    settings = 'settings',
}

export type AppRoutes = typeof AppRoutes;
export const AppRoutes = {
    ...PageRoutes,
}