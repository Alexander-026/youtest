import type { WordPairCard, InputPairs, Pair } from "../../types/wordPairs"
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
    updateWordPairs: builder.mutation<WordPairCard, { id: string, pairsWord: Pair[] }>({
      query: data => ({
        url: `${import.meta.env.VITE_WORD_PAIRS_URL}/update`,
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
  useDeleteWordPairsMutation,
  useGetWordPairsQuery,
} = wordPairsApiSlice
