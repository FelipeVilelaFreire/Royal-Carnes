import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import type {
  AdminUserFormInput,
  AdminUserListItemView,
  AdminUserListParams,
} from "../contracts/user.contract";
import { adminUsersApi, type createAdminUsersApi } from "../api/users.api";
import { createAdminUsersViewModel } from "../view-models/users.view-model";

type AdminUsersApi = ReturnType<typeof createAdminUsersApi>;

export interface UseAdminUsersOptions {
  api?: AdminUsersApi;
  initialUsers?: AdminUserListItemView[];
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const api = options.api || adminUsersApi;
  const [users, setUsers] = useState<AdminUserListItemView[]>(
    options.initialUsers || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(
    async (params: AdminUserListParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextUsers = await api.list(params);
        setUsers(nextUsers);
        return nextUsers;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  const create = useCallback(
    async (input: AdminUserFormInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await api.create(input);
        setUsers((current) => [created, ...current]);
        return created;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  return useMemo(
    () => ({
      users,
      viewModel: createAdminUsersViewModel(users),
      isLoading,
      error,
      load,
      create,
    }),
    [create, error, isLoading, load, users],
  );
}

