import * as yup from "yup"

const pattern =
  /^([a-zA-ZäöüßÄÖÜ\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜ\s-]{2,})? - [a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,})?,[ \t]*){0,99}[a-zA-ZäöüßÄÖÜ\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜ\s-]{2,})? - [a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,})?[.,]?[ \t]*$/

const pairsSchema = {
  pairs: yup
    .string()
    .required("Pairs is required")
    .matches(pattern, {
      message: `The format should be written in this form:
      Foreign - Native,
      Foreign - Native,
      Foreign - Native. 
    `,
      excludeEmptyString: true,
    }),
}

export const wordPairsSchema = yup
  .object({
    title: yup.string().required("Title is required").min(2, "min 2 charates"),
    pairsWord: pairsSchema.pairs,
  })
  .required()

export const addManySchema = yup.object({
  ...pairsSchema
}).required()
