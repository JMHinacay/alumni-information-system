import { useState, useContext } from 'react';
// contexts
import { AccountContext } from '../components/accessControl/AccountContext';
import { PatientContext } from '../components/context/PatientContext';
// 3rd-party-lib
import merge from 'lodash/merge';
import { useMutation } from '@apollo/react-hooks';

const formatOptions = (
  accountContext,
  patientContext,
  options = {},
  dependencies = [],
  propertyNames = {},
) => {
  const selectedClinic = accountContext?.selectedClinic || null;
  const client = accountContext.client?.id || null;
  const patient = patientContext?.id || null;
  const clinic = selectedClinic?.id || null;

  let defaultPropertyNames = { client: 'client_id', clinic: 'clinic_id', patient: 'patient_id' };
  propertyNames = merge(defaultPropertyNames, propertyNames);
  const variables = { client, patient, clinic };

  let defaultVariables = {};

  const supportedDependencies = ['client', 'clinic', 'patient'];
  if (dependencies.length > 0) {
    // check the dependencies don't accept unsupported deps
    dependencies.forEach((value) => {
      if (!supportedDependencies.includes(value)) {
        throw new Error(
          `We don't support this dependency, Please remove it from deps array: ${value}`,
        );
      } else {
        defaultVariables[propertyNames[value]] = variables[value];
      }
    });
    // create the default variables
  } else {
    throw new Error('Dependency array must not be empty');
  }

  options.variables = merge(options.variables, defaultVariables);

  return options;
};

const useContextMutation = (query, options = {}, dependencies = [], propertyNames = {}) => {
  const { data } = useContext(AccountContext);
  const { currentPatient } = useContext(PatientContext);

  options = formatOptions(data, currentPatient, options, dependencies, propertyNames);

  const [mutateFunction, result] = useMutation(query, options);

  const mutate = (finalOptions = {}, finalDependencies = [], finalPropertyNames = {}) => {
    finalDependencies = merge(finalDependencies, dependencies);
    finalOptions = formatOptions(
      data,
      currentPatient,
      finalOptions,
      finalDependencies,
      finalPropertyNames,
    );

    return mutateFunction(finalOptions);
  };

  return [mutate, result];
};

export default useContextMutation;
