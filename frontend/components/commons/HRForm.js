import { FormProvider } from 'react-hook-form';

function HRForm({ methods, ...props }) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(props.onSubmit)}>{props.children}</form>
    </FormProvider>
  );
}

export default HRForm;
