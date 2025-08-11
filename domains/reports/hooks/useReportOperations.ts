import { useQuery, useMutation } from "@apollo/client";
import {
  GET_REPORT_METADATA,
  GET_REPORT_TEMPLATES,
  GET_REPORT_JOB,
  GENERATE_REPORT,
  SAVE_REPORT_TEMPLATE,
  UPDATE_REPORT_TEMPLATE,
  DELETE_REPORT_TEMPLATE,
} from "../graphql/operations";
import type {
  ReportMetadata,
  ReportTemplate,
  ReportJob,
  ReportConfig,
} from "../types/report.types";

export function useReportOperations() {
  // Queries
  const {
    data: metadataData,
    loading: metadataLoading,
    error: metadataError,
    refetch: refetchMetadata,
  } = useQuery<{ reportMetadata: ReportMetadata }>(GET_REPORT_METADATA);

  const {
    data: templatesData,
    loading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useQuery<{
    reportTemplates: ReportTemplate[];
  }>(GET_REPORT_TEMPLATES);

  // Mutations
  const [generateReportMutation] = useMutation<
    { generateReport: ReportJob },
    { config: ReportConfig }
  >(GENERATE_REPORT);

  const [saveTemplateMutation] = useMutation<
    { saveReportTemplate: ReportTemplate },
    { template: Omit<ReportTemplate, "id"> }
  >(SAVE_REPORT_TEMPLATE);

  const [updateTemplateMutation] = useMutation<
    { updateReportTemplate: ReportTemplate },
    { id: string; template: Partial<ReportTemplate> }
  >(UPDATE_REPORT_TEMPLATE);

  const [deleteTemplateMutation] = useMutation<
    { deleteReportTemplate: boolean },
    { id: string }
  >(DELETE_REPORT_TEMPLATE);

  // Report Generation
  const generateReport = async (config: ReportConfig) => {
    try {
      const { data } = await generateReportMutation({
        variables: { config },
      });
      return data?.generateReport;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  };

  // Template Operations
  const saveTemplate = async (template: Omit<ReportTemplate, "id">) => {
    try {
      const { data } = await saveTemplateMutation({
        variables: { template },
      });
      return data?.saveReportTemplate;
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  };

  const updateTemplate = async (
    id: string,
    template: Partial<ReportTemplate>
  ) => {
    try {
      const { data } = await updateTemplateMutation({
        variables: { id, template },
      });
      return data?.updateReportTemplate;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { data } = await deleteTemplateMutation({
        variables: { id },
      });
      return data?.deleteReportTemplate;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  };

  // Job Status Query
  const useReportJobStatus = (jobId: string) => {
    const { data, loading, error, refetch } = useQuery<{
      reportJob: ReportJob;
    }>(GET_REPORT_JOB, {
      variables: { id: jobId },
      pollInterval: 2000, // Poll every 2 seconds
      skip: !jobId,
    });

    return {
      job: data?.reportJob,
      loading,
      error,
      refetch,
    };
  };

  return {
    // Metadata
    metadata: metadataData?.reportMetadata,
    metadataLoading,
    metadataError,
    refetchMetadata,

    // Templates
    templates: templatesData?.reportTemplates || [],
    templatesLoading,
    templatesError,
    refetchTemplates,

    // Operations
    generateReport,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    useReportJobStatus,
  };
}
