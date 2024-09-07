import { Avatar, Box, Button, styled } from "@mui/material"
import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import type { UseFormSetValue } from "react-hook-form"
import { MdAddAPhoto } from "react-icons/md"
import { MdOutlineDeleteOutline } from "react-icons/md"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const InputFileUpload: React.FC<UploadInput> = ({ onChange }) => {
  return (
    <Button
      component="label"
      variant="outlined"
      sx={{
        borderRadius: "50%",
        width: 100,
        height: 100,
        mx: "auto",
        borderColor: "rgba(0, 0, 0, 0.23)",
      }}
    >
      <MdAddAPhoto color="rgba(0, 0, 0, 0.23)" size={20} />
      <VisuallyHiddenInput type="file" onChange={onChange} accept="image/*" />
    </Button>
  )
}

type UploadInput = {
  onChange: (e: any) => void
}

type UploadTypes = {
  setFormData: Dispatch<SetStateAction<FormData | null>>
  setValue: UseFormSetValue<any>
  value?: string
}

const Upload: React.FC<UploadTypes> = ({ setFormData, setValue, value }) => {
  const [fileName, setFileName] = useState<string>("")

  const uploadFileHandler = (e: any) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name)
      const formData = new FormData()
      formData.append("image", e.target.files[0])
      setFormData(formData)
    }

    if (e.target.files) {
      setValue("image", URL.createObjectURL(e.target.files[0]), {
        shouldDirty: true,
      })
    }
  }


  const isBlob = value ? value.startsWith("blob:") : false

  return (
    <>
      {value ? (
        <Box
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            position: "relative",
            cursor: "pointer",
            ":hover .back": {
              opacity: 1,
            },
          }}
        >
          <Box
            className="back"
            sx={{
              position: "absolute",
              background: "rgba(0, 0, 0, 0.50)",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: 100,
              borderRadius: "50%",
              opacity: 0,
              transition: "all .26s linear",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                setFileName("")
                setFormData(null)
                setValue("image", "", { shouldDirty: true })
                // URL.revokeObjectURL(value)
              }}
            >
              <MdOutlineDeleteOutline color="white" size={20} />
            </Button>
          </Box>
          <Avatar
            alt={fileName}
            src={isBlob ? value : `${import.meta.env.VITE_LOCAL_URL}/${value}`}
            // src={isBlob ? value : `${import.meta.env.VITE_BASE_URL}/${value}`}
            sx={{ width: "100%", height: "100%" }}
          />
        </Box>
      ) : (
        <InputFileUpload onChange={e => uploadFileHandler(e)} />
      )}
    </>
  )
}

export default Upload
