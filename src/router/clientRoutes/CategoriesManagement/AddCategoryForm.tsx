import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { useNavigate, useParams } from "react-router-dom";
import { FaTimes, FaPen, FaCheckCircle } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addCategory } from "../../../services/ApiServices/categoryService";


interface AddCategoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchCategory: () => void;
}

const AddCategoryModal = ({ isOpen, setIsOpen, fetchCategory }: AddCategoryModalProps) => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token)

  const navigate = useNavigate();

  const categoryFormSchema = z.object({
    categoryName: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
  });

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
  });

  useEffect(() => {

  }, [isOpen, id, form]);

  const handleSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      //console.log(values);
      if (!token) {
        navigate("/login");
        return;
      }
      await addCategory(values, token);
      form.reset();
      //console.log("Service created successfully:", response.data);
      setIsOpen(false);
      fetchCategory();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaPen className="text-sky-500" />
                {"Add new category"}
              </h3>
              <button onClick={() => { setIsOpen(false); form.reset() }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Name</Label>
                <div className="relative">
                  <Input
                    {...form.register("categoryName")}
                    placeholder="Name"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaPen className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.categoryName && <p className="text-red-500 text-sm">{form.formState.errors.categoryName.message}</p>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Description</Label>
                <div className="relative">
                  <Textarea
                    {...form.register("description")}
                    placeholder="Description"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaPen className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition-all gap-3 w-[40%]"
                >
                  <FaCheckCircle className="text-white text-xl" />
                  <div className="text-white">
                  Add Category
                  </div>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCategoryModal;
