DROP TABLE IF EXISTS public.agent;
CREATE TABLE public.agent (
                                id                      uuid primary key,
                                agent_name            varchar null,
                                agent_organization            varchar null,
                                status bool default true

);


ALTER TABLE lot.lot_transaction

    ADD COLUMN agent uuid null,
    ADD CONSTRAINT lot_transaction_fkey FOREIGN KEY (agent) REFERENCES public.agent(id);