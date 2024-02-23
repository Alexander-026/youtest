import type {
  WordPairCard,
  InputPairs,
  GradingInput,
} from "../../types/wordPairs"
import { apiSlice } from "./apiSlice"

export const wordPairsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createWordPairs: builder.mutation<WordPairCard, InputPairs>({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["wordPairs"],
    }),
    visitWordPairs: builder.mutation<WordPairCard, { id: string }>({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/visit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["wordPairs"],
    }),
    updateWordPairs: builder.mutation<
      WordPairCard,
      Omit<GradingInput, "grade">
    >({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["wordPairs"],
    }),
    evaluateTest: builder.mutation<WordPairCard, GradingInput>({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/evaluate`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["wordPairs"],
    }),
    deleteWordPairs: builder.mutation<void, { id: string }>({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/delete`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["wordPairs"],
    }),
    getWordPairs: builder.query<WordPairCard[], string>({
      query: id => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/getAll/${id}`,
      }),
      providesTags: ["wordPairs"],
    }),
  }),
})

export const {
  useCreateWordPairsMutation,
  useVisitWordPairsMutation,
  useUpdateWordPairsMutation,
  useEvaluateTestMutation,
  useDeleteWordPairsMutation,
  useGetWordPairsQuery,
} = wordPairsApiSlice
