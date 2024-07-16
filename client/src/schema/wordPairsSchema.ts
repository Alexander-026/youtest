import * as yup from "yup"

// const pattern =
//   /^([a-zA-ZäöüßÄÖÜ\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜ\s-]{2,})? - [a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,})?,[ \t]*){0,99}[a-zA-ZäöüßÄÖÜ\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜ\s-]{2,})? - [a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜа-яА-Я\s-]{2,})?[.,]?[ \t]*$/
// const pattern = /^([\p{L}\s]{3,}?)\s*=\s*([\p{L}\s]{3,}?)$/gu
const pattern =  /^([a-zA-ZäöüßÄÖÜ\s-]{2,}(?:\s[a-zA-ZäöüßÄÖÜ\s-]{2,})?)\s*=\s*([а-яА-Я\s-]{2,}(?:\s[а-яА-Я\s-]{2,})?)$/gm;




const pairsSchema = {
  pairs: yup.string().required("Pairs is required")
  .matches(pattern, {
    message: `The format should be written in this form:
    Foreign = Native\s
    Foreign = Native\s
    Foreign = Native\s
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

export const addManySchema = yup
  .object({
    ...pairsSchema,
  })
  .required()



  
  
   
   
   
   
  
  
  
  
   
   
  
   
  
   
   
   
   
   
  
  
  
  
  
  
  
  
  
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


