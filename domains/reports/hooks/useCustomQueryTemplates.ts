import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import {
  SAVE_CUSTOM_QUERY_TEMPLATE,
  GET_CUSTOM_QUERY_TEMPLATES,
} from "../graphql/custom-query-operations";

export function useCustomQueryTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);

  // Fetch templates
  const { data, loading, error, refetch } = useQuery(
    GET_CUSTOM_QUERY_TEMPLATES,
    {
      fetchPolicy: "cache-first",
    }
  );

  // Save template mutation
  const [saveTemplateMutation] = useMutation(SAVE_CUSTOM_QUERY_TEMPLATE);

  // Update templates when data changes
  useEffect(() => {
    if (data?.customQueryTemplates) {
      setTemplates(data.customQueryTemplates);
    }
  }, [data]);

  // Save template function
  const saveTemplate = async (template: any) => {
    try {
      const { data } = await saveTemplateMutation({
        variables: { input: template },
      });
      
      await refetch();
      return data?.insertCustomQueryTemplatesOne;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  };

  return {
    templates: data?.customQueryTemplates || [],
    loading,
    error: error?.message,
    refetch,
    saveTemplate,
  };
}
