import { api } from "@/lib/apiClient";
import {
  CreateCompetitionPayload,
  CreateCompetitionResponseData,
  FetchCompetitionByIdResponseData,
  FetchCompetitionsResponseData,
} from "@/types";

const createCompetition = async (
  payload: CreateCompetitionPayload,
  bannerImage: File
): Promise<CreateCompetitionResponseData | undefined> => {
  const formData = new FormData();

  formData.append("bannerImage", bannerImage);

  formData.append("data", JSON.stringify(payload));

  const response = await api.post<CreateCompetitionResponseData>(
    "/competition/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};

const fetchMyCompetitions = async (): Promise<
  FetchCompetitionsResponseData | undefined
> => {
  const response = await api.get<FetchCompetitionsResponseData>(
    "/competition?user=true"
  );
  return response.data.data;
};

const fetchCompetitionById = async (
  id: string
): Promise<FetchCompetitionByIdResponseData | undefined> => {
  const response = await api.get<FetchCompetitionByIdResponseData>(
    `/competition/${id}`
  );
  return response.data.data;
};

const competitionService = {
  createCompetition,
  fetchMyCompetitions,
  fetchCompetitionById,
};

export default competitionService;
