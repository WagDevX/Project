interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  return (
    <main className="flex justify-center h-screen ">
      <div className="flex flex-col max-w-[1200px] w-full">{children}</div>
    </main>
  );
};
