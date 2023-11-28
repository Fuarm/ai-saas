"use client";

import axios from "axios";
import * as z from "zod";

import {IMAGE} from "@/constants";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {amountOptions, formSchema, resolutionOptions} from "./constants";

import Heading from "@/components/heading";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import {Card, CardFooter} from "@/components/ui/card";
import Image from "next/image";
import {Download} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useProModal} from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const ImagePage = () => {
  const proModal = useProModal();
  const router = useRouter();

  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512✕512"
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/image", values);

      const urls = response.data.map((image: {url: string}) => image.url);

      setImages(urls);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  }

  return (
    <>
      <Heading
        title={IMAGE.label}
        description={IMAGE.desc}
        icon={IMAGE.icon}
        iconColor={IMAGE.color}
        bgColor={IMAGE.bgColor}
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField name="prompt" render={({field}) => (
              <FormItem className="col-span-12 lg:col-span-6">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none px-4 bg-[#e8f0fe] focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading}
                    placeholder="a horse in swiss alps"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
            <FormField name="amount" control={form.control} render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-2">
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          { option.label }
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField name="resolution" control={form.control} render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-2">
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          { option.label }
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <Button className="col-span-12 lg:col-span-2" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4 px-4">
        {
          isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )
        }
        {
          images.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {
            images.map(image => (
              <Card key={image} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={image} alt="Image" fill />
                </div>
                <CardFooter className="p-2">
                  <Button variant="secondary" className="w-full" onClick={() => window.open(image)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default ImagePage;
