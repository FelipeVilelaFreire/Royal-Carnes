export interface AdminNavigationItem {
  key: string;
  labelKey: string;
  screenKey: string;
  routeKey: string;
  order: number;
  placements: {
    header: boolean;
    sidebar: boolean;
    drawer: boolean;
    bottomBar: boolean;
    footer: boolean;
  };
}

export const adminNavigation: AdminNavigationItem[] = [
  {
    key: "dashboard",
    labelKey: "admin.navigation.dashboard",
    screenKey: "dashboard",
    routeKey: "/admin",
    order: 0,
    placements: {
      header: false,
      sidebar: true,
      drawer: false,
      bottomBar: false,
      footer: false
    }
  },
  {
    key: "subscribers",
    labelKey: "admin.navigation.subscribers",
    screenKey: "subscribers",
    routeKey: "/admin/assinantes",
    order: 1,
    placements: {
      header: false,
      sidebar: true,
      drawer: false,
      bottomBar: false,
      footer: false
    }
  },
  {
    key: "deliveries",
    labelKey: "admin.navigation.deliveries",
    screenKey: "deliveries",
    routeKey: "/admin/expedicao",
    order: 2,
    placements: {
      header: false,
      sidebar: true,
      drawer: false,
      bottomBar: false,
      footer: false
    }
  }
];
