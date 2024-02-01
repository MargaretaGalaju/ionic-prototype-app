enum PageRoutes {
    home = 'home',
    search = 'search',
    settings = 'settings',
}

export type AppRoutes = typeof AppRoutes;
export const AppRoutes = {
    ...PageRoutes,
}