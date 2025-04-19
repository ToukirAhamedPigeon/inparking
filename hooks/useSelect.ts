import { useState, useEffect } from "react";
import api from "@/lib/axios";

type OptionType = Record<string, any>;

type UseSelectParams = {
  apiUrl: string;
  search: string;
  filter?: Record<string, any>;
  limit?: number;
  multiple?: boolean;
  optionValueKey?: string;
  optionLabelKeys?: string[];
  optionLabelSeparator?: string;
  initialValue?: any;
};

export function useSelect({
  apiUrl,
  search,
  filter = {},
  limit = 50,
  multiple = false,
  optionValueKey = "_id",
  optionLabelKeys = ["name"],
  optionLabelSeparator = " ",
  initialValue,
}: UseSelectParams) {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(multiple ? [] : null);
  const authUser = localStorage.getItem("authUser");
  const token = JSON.parse(authUser || "{}").token;

  // Fetch options based on search and filter
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await api.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: search, limit, ...filter },
        });
        setOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch select options", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [search, JSON.stringify(filter), limit, apiUrl]);

  // Handle initial value loading
  useEffect(() => {
    const loadInitialValue = async () => {
      if (!initialValue) return;

      if (multiple) {
        setSelected(initialValue);
        return;
      }

      setSelected(initialValue);

      // Check if the item already exists in options before fetching
      const exists = options.some((opt) => opt[optionValueKey] === initialValue);
      if (!exists) {
        try {
          const res = await api.get(`${apiUrl}/${initialValue}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOptions((prev) => {
            const alreadyIn = prev.some((opt) => opt[optionValueKey] === res.data[optionValueKey]);
            return alreadyIn ? prev : [...prev, res.data];
          });
        } catch (err) {
          console.error("Failed to fetch initial option", err);
        }
      }
    };

    loadInitialValue();
    // Depend on initialValue and options length (to re-check if new options come in)
  }, [initialValue, options.length]);

  const getOptionLabel = (option: OptionType): string => {
    return optionLabelKeys.map((key) => option?.[key]).filter(Boolean).join(optionLabelSeparator);
  };

  return {
    options,
    loading,
    selected,
    setSelected,
    getOptionLabel,
  };
}
