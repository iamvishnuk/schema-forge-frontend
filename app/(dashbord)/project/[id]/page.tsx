import ProjectTabs from '../_components/ProjectTabs';

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div className='h-full'>
      <ProjectTabs projectId={id} />
    </div>
  );
};

export default page;
