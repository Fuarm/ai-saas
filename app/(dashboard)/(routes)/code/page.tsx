"use client";

import axios from "axios";
import * as z from "zod";

import {CODE} from "@/constants";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";

import Heading from "@/components/heading";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {formSchema} from "./constants";
import {Button} from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import ReactMarkdown from "react-markdown";

import OpenAI from "openai";
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;
import {cn} from "@/lib/utils";
import {BotAvatar, UserAvatar} from "@/components/avatar";
import {useProModal} from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessage = {
        role: "user",
        content: values.prompt
      }

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages
      });

      setMessages((current) => [...current, userMessage, response.data]);

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
        title={CODE.label}
        description={CODE.desc}
        icon={CODE.icon}
        iconColor={CODE.color}
        bgColor={CODE.bgColor}
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField name="prompt" render={({field}) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none px-4 bg-[#e8f0fe] focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading}
                    placeholder="Simple toggle button using react hooks."
                    {...field}
                  />
                </FormControl>
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
          messages.length === 0 && !isLoading && (
            <Empty label="No code generated." />
          )
        }
        <div className="flex flex-col-reverse gap-y-4">
          {
            messages.map((message) => (
              <div
                key={message.content}
                className={cn("p-8 w-full flex items-center gap-x-8 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  className="text-sm overflow-hidden leading-7"
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    )
                  }}
                >
                  { message.content || "" }
                </ReactMarkdown>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default CodePage;
